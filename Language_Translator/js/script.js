const FromText = document.querySelector('.from_text')
const ToText = document.querySelector('.to_text')
const ExchangeIcon = document.querySelector('.exchange')
const SelectTag = document.querySelectorAll('select')
const Icons = document.querySelectorAll('.row i')
const TranslateBtn = document.querySelector('button')


SelectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "hi-IN" ? "selected" : ""
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`
        tag.insertAdjacentHTML("beforeend", option)
    }
});

ExchangeIcon.addEventListener("click", () => {
    let TempText = FromText.value,
        TempLang = SelectTag[0].value
    FromText.value = ToText.value
    ToText.value = TempText
    SelectTag[0].value = SelectTag[1].value
    SelectTag[1].value = TempLang
})

FromText.addEventListener("keyup", () => {
    if (!FromText.value) {
        ToText.value = ""
    }
})

TranslateBtn.addEventListener("click", () => {
    let Text = FromText.value.trim(),
        TranslateFrom = SelectTag[0].value,
        TranslateTo = SelectTag[1].value
    if (!Text) return
    ToText.setAttribute("placeholder", "Translating...")
    let APIUrl = `https://api.mymemory.translated.net/get?q=${Text}&langpair=${TranslateFrom}|${TranslateTo}`
    fetch(APIUrl).then(res => res.json()).then(data => {
        ToText.value = data.responseData.TranslatedText
        data.matches.forEach(data => {
            if (data.id === 0) {
                ToText.value = data.translation
            }
        })
        ToText.setAttribute("placeholder", "Translation")
    })
})
Icons.forEach(icon => {
    icon.addEventListener('click',({target}) =>{
        if(!FromText.value || !ToText.value) return
        if(target.classList.contains('fa-copy')){
            if(target.id == 'from'){
                navigator.clipboard.writeText(FromText.value)
            }
            else{
                navigator.clipboard.writeText(ToText.value)
            }
        }
        else{
            let utterance
            if(target.id == 'from'){
                utterance = new SpeechSynthesisUtterance(FromText.value)
                utterance.lang = SelectTag[0].value
            }
            else{
                utterance = new SpeechSynthesisUtterance(ToText.value)
                utterance.lang = SelectTag[1].value
            }
            speechSynthesis.speak(utterance)
        }
    })
})
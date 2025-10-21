import { useEffect } from "react"

export function GoogleTranslate() {
  useEffect(() => {
    const addScript = document.createElement("script")
    addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    document.body.appendChild(addScript)

    // Inicializar quando script carregar
    ;(window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "pt", // idioma original do site
          includedLanguages: "pt,en,es", // idiomas permitidos
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      )
    }
  }, [])

  return <div id="google_translate_element" className="text-sm" />
}

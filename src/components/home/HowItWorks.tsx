const STEPS = [
  {
    label: "Consultez les infrastructures",
    description: "Découvrez les serveurs présentés selon leur profil B2B.",
  },
  {
    label: "Choisissez votre sujet",
    description: "Sélectionnez le serveur ou le domaine qui vous intéresse.",
  },
  {
    label: "Ouvrez WhatsApp",
    description: "Votre demande est préremplie avec le contexte de votre visite.",
  },
  {
    label: "Échangez avec l'équipe",
    description: "Discutez directement avec Pluton OTT pour vos volumes.",
  },
] as const;

export default function HowItWorks() {
  return (
    <section className="scrolly-section py-20 px-4 bg-ink">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-on-paper mb-16 text-center">
          Comment ça marche ?
        </h2>

        <div className="relative">
          {/* Connecting line — desktop only, sits behind dots */}
          <div
            className="absolute top-[5px] left-[12.5%] right-[12.5%] h-px bg-paper-2 hidden lg:block"
            aria-hidden="true"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-col lg:items-center">
                {/* Dot + step number */}
                <div className="relative z-10 flex flex-col lg:items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-signal mb-2.5" aria-hidden="true" />
                  <span className="font-mono text-[0.6rem] text-signal/50 tracking-[0.12em]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="font-semibold text-on-paper mb-2 text-sm lg:text-center">
                  {step.label}
                </h3>
                <p className="text-xs text-dim-paper leading-relaxed lg:text-center">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

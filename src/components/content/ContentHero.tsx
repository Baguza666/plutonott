import Image from 'next/image';

interface ContentHeroProps {
  h1: string;
  h2: string | null;
  imagePath?: string;
}

export default function ContentHero({ h1, h2, imagePath }: ContentHeroProps) {
  return (
    <div className="relative overflow-hidden w-full">
      {/* Orbes de lumière décoratives */}
      <div className="absolute top-[-50%] left-[-20%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none " aria-hidden="true" />
      <div className="absolute top-0 right-[-10%] w-[300px] h-[300px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none " style={{ animationDelay: '3s' }} aria-hidden="true" />
      
      <header className="px-4 pt-12 pb-8 md:pt-16 md:pb-10 max-w-4xl mx-auto animate-fade-up relative z-10 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gradient-dark mb-4 leading-[1.1]">
          {h1}
        </h1>
        {h2 && (
          <p className="text-lg md:text-xl text-dim-paper leading-relaxed max-w-2xl mb-4">
            {h2}
          </p>
        )}
      </header>
    </div>
  );
}

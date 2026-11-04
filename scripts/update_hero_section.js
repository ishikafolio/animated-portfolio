const fs = require('fs');

let c = fs.readFileSync('src/components/home/HeroSection.tsx', 'utf8');

const target = `              {/* Verified Details Pill Strip */}
              <div className="hero-detail-item pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-[#24121B]/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#890149]" />
                  <a href="#showcase-uiux" data-character-mood="Curious">UI/UX Design</a>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#890149]" />
                  <a href="#showcase-logo" data-character-mood="Curious">Brand Identity</a>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#890149]" />
                  <a href="#showcase-packaging" data-character-mood="Curious">Packaging Systems</a>
                </span>
              </div>`;

const replacement = `              {/* Core Specialty Focus Items */}
              <div className="hero-detail-item pt-3 sm:pt-4 flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-2.5 sm:gap-y-3 text-[16px] sm:text-[18px] font-sans font-medium text-[#24121B] leading-normal">
                <span className="inline-flex items-center gap-2 sm:gap-2.5 shrink-0">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#890149] shrink-0" aria-hidden="true" />
                  <a
                    href="#showcase-uiux"
                    data-character-mood="Curious"
                    className="text-[#24121B] hover:text-[#890149] transition-colors focus-visible:outline-[#890149] underline-offset-4 hover:underline"
                  >
                    UI/UX Design
                  </a>
                </span>

                <span className="inline-flex items-center gap-2 sm:gap-2.5 shrink-0">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#890149] shrink-0" aria-hidden="true" />
                  <a
                    href="#chapter-identity"
                    data-character-mood="Curious"
                    className="text-[#24121B] hover:text-[#890149] transition-colors focus-visible:outline-[#890149] underline-offset-4 hover:underline"
                  >
                    Brand Identity
                  </a>
                </span>

                <span className="inline-flex items-center gap-2 sm:gap-2.5 shrink-0">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#890149] shrink-0" aria-hidden="true" />
                  <a
                    href="#showcase-packaging"
                    data-character-mood="Curious"
                    className="text-[#24121B] hover:text-[#890149] transition-colors focus-visible:outline-[#890149] underline-offset-4 hover:underline"
                  >
                    Packaging Systems
                  </a>
                </span>
              </div>`;

const crlfTarget = target.replace(/\r?\n/g, '\r\n');
const crlfReplacement = replacement.replace(/\r?\n/g, '\r\n');

if (c.includes(crlfTarget)) {
  c = c.replace(crlfTarget, crlfReplacement);
  fs.writeFileSync('src/components/home/HeroSection.tsx', c);
  console.log('Successfully updated HeroSection.tsx (CRLF)');
} else {
  const lfTarget = target.replace(/\r?\n/g, '\n');
  const lfReplacement = replacement.replace(/\r?\n/g, '\n');
  if (c.includes(lfTarget)) {
    c = c.replace(lfTarget, lfReplacement);
    fs.writeFileSync('src/components/home/HeroSection.tsx', c);
    console.log('Successfully updated HeroSection.tsx (LF)');
  } else {
    console.error('Target not found in HeroSection.tsx');
  }
}

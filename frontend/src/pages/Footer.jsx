import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import travelmateLogo from "../assets/images/travelmate-logo.png";

function Footer() {
  return (
    <footer className="
      relative
      border-t
      border-white/20
      bg-gradient-to-r from-blue-900/40 via-blue-800/30 to-transparent
      px-6
      py-12
      backdrop-blur-3xl
      md:px-12
    ">

      {/* Top blend to soften the seam with the page above */}
      <div className="absolute -top-6 left-0 right-0 h-12 pointer-events-none bg-gradient-to-b from-blue-900/40 via-blue-800/20 to-transparent blur-[10px]" />

      <div className="mx-auto max-w-6xl">

        <div className="
          relative
          rounded-[28px]
          border
          border-white/15
          bg-gradient-to-b from-white/8 to-white/4
          p-7
          shadow-[0_30px_80px_rgba(2,6,23,0.22)]
          backdrop-blur-3xl
          md:p-9
        ">

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/6 to-white/3 mix-blend-overlay rounded-[28px]" />

          <div className="
            grid
            gap-9
            md:grid-cols-3
          ">

            {/* BRAND */}

            <div>

              <div className="flex items-center gap-0">

                <img
                  src={travelmateLogo}
                  alt="TravelMate Logo"
                  className="h-12 w-14 object-contain"
                />

                <h2 className="
                  text-2xl
                  font-bold
                  text-white
                  drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]
                ">
                  TravelMate
                </h2>

              </div>

              <p className="
                mt-3
                max-w-sm
                text-sm
                leading-6
                text-white/85
                drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]
              ">
                Your trusted travel companion to
                explore the incredible places across
                India. Let's make every journey
                memorable!
              </p>

            </div>


            {/* CONTACT */}

            <div>

              <h3 className="
                text-lg
                font-semibold
                text-white
                drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]
              ">
                Contact with TravelMate
              </h3>

              <div className="
                mt-4
                space-y-3
                text-sm
                text-white/85
                drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]
              ">

                <p className="flex items-center gap-3">
                  <Phone size={17} />
                  +91 98765 43210
                </p>

                <p className="flex items-center gap-3">
                  <Mail size={17} />
                  support@travelmate.com
                </p>

                <p className="flex items-center gap-3">
                  <MapPin size={17} />
                  Kolkata, West Bengal, India
                </p>

              </div>

            </div>


            {/* SOCIAL MEDIA */}

            <div>

              <h3 className="
                text-lg
                font-semibold
                text-white
                drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]
              ">
                Follow TravelMate
              </h3>

              <p className="
                mt-2
                text-sm
                text-white/75
                drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]
              ">
                Stay connected with us.
              </p>

              <div className="
                mt-5
                flex
                gap-3
              ">

                {/* Instagram */}

                <a
                  href="#"
                  aria-label="Instagram"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    text-white
                    backdrop-blur-md
                    transition
                    hover:-translate-y-1
                    hover:bg-white/20
                  "
                >
                 <span className="text-lg font-bold">
  ◎
</span>
                </a>


                {/* Facebook */}

                <a
                  href="#"
                  aria-label="Facebook"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    text-white
                    backdrop-blur-md
                    transition
                    hover:-translate-y-1
                    hover:bg-white/20
                  "
                >
                  <span className="text-lg font-bold">
                    f
                  </span>
                </a>


                {/* X / Twitter */}

                <a
                  href="#"
                  aria-label="Twitter"
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    text-white
                    backdrop-blur-md
                    transition
                    hover:-translate-y-1
                    hover:bg-white/20
                  "
                >
                  <span className="text-lg font-bold">
                    𝕏
                  </span>
                </a>

              </div>

            </div>

          </div>


          {/* BOTTOM */}

          <div className="
            mt-9
            border-t
            border-white/10
            pt-5
            text-center
            text-xs
            text-white/70
            drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]
          ">
            © 2026 TravelMate. All rights reserved.
          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
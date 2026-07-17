// WelcomeCard.jsx - Welcome card component
import { Link } from "react-router-dom";
import { User, Mail, ArrowRight, Sparkles } from "lucide-react";
import Tilt from "react-parallax-tilt";
const WelcomeCard = ({ user }) => (
  // <div
  //   className="bg-cover bg-[#111111] rounded-md border border-white/20 shadow-sm bg-center flex items-center justify-center"
  //   style={{ backgroundImage: 'url("/process.png")' }}
  // >
  //   <div className="relative w-full overflow-hidden">
  //     <div className="p-4 flex flex-col justify-center">
  //       <h2 className="text-xl font-semibold text-gray-100 mb-1">
  //         Welcome {user?.fullname}
  //       </h2>
  //       <p className="text-sm text-gray-300">{user?.email}</p>
  //       <p className="text-sm text-gray-300 mt-2 mb-4">
  //         Thanks for joining us! You're now part of the community.
  //       </p>
  //       <Link
  //         to="#"
  //         className="inline-block bg-indigo-600 w-28 text-center text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
  //       >
  //         View Profile
  //       </Link>
  //     </div>
  //   </div>
  // </div>
  <Tilt
    className="tilt-card-wrapper h-full"
    perspective={1000}
    glareEnable={true}
    glareMaxOpacity={0.15}
    glareColor="#e6c57f"
    scale={1.02}
  >
    <div className="relative overflow-hidden glass-card glass-card-hover animated-border-gold tilt-card-inner rounded-2xl h-full flex flex-col justify-center">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-gold-medium/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gold-dark/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-gold-light/5 rounded-full blur-2xl"></div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.05)_1px,transparent_1px)] [background-size:22px_22px] z-0"></div>
      <div className="relative p-8 z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-12 flex justify-center items-center rounded-full border-2 border-gold-medium/50 shadow-[0_0_15px_rgba(212,175,55,0.3)] bg-dark-900/50 backdrop-blur-sm">
          <User
            className="w-7 h-7 text-gold-light"
          />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display gold-gradient-text">
              Welcome, {user?.fullname}! 🌟
            </h2>
            <div className="flex items-center gap-2 text-gray-400 mt-1">
              <Mail className="w-4 h-4 text-gold-medium" />
              <span className="text-sm">{user?.email}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="group relative overflow-hidden bg-dark-900/80 border border-gold-medium/30 rounded-lg px-4 py-2 hover:bg-dark-800 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-medium/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            <span className="relative flex items-center gap-2 text-gold-light text-sm font-semibold">
              View Profile
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-medium/50 to-transparent"></div>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-gold-medium/30 rounded-tr-lg z-10"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-gold-dark/30 rounded-bl-lg z-10"></div>
    </div>
  </Tilt>
);

export default WelcomeCard;

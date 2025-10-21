const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7070";

const providers = [
  {
    name: "Google",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="w-6 h-6"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.04 0 5.6 1.05 7.68 3.1l5.7-5.7C33.64 3.75 29.2 2 24 2 14.64 2 6.68 7.64 3.18 15.26l6.84 5.3C11.56 14.5 17.24 9.5 24 9.5z"
        />
        <path
          fill="#34A853"
          d="M46.1 24.5c0-1.6-.14-3.13-.39-4.63H24v9.25h12.55c-.54 2.8-2.12 5.18-4.51 6.78l7.03 5.46C43.64 37.48 46.1 31.52 46.1 24.5z"
        />
        <path
          fill="#4A90E2"
          d="M10.02 28.58a14.51 14.51 0 0 1-.79-4.58c0-1.6.28-3.15.79-4.58l-6.84-5.3A21.98 21.98 0 0 0 2 24c0 3.58.86 6.96 2.37 9.88l6.84-5.3z"
        />
        <path
          fill="#FBBC05"
          d="M24 46c5.2 0 9.64-1.72 12.84-4.7l-7.03-5.46C27.84 37.6 26.02 38 24 38c-6.76 0-12.44-5-13.98-11.78l-6.84 5.3C6.68 40.36 14.64 46 24 46z"
        />
      </svg>
    ),
    url: `${API_URL}/api/auth/google`,
    bg: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100",
  },
//   {
//     name: "Apple",
//     logo: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 14 17"
//         fill="currentColor"
//         className="w-5 h-5"
//       >
//         <path d="M13.962 13.186a9.406 9.406 0 01-1.098 2.015C11.99 16.217 11.204 17 10.114 17c-.635 0-1.39-.209-2.25-.209-.897 0-1.627.215-2.297.215-.993 0-1.777-.829-2.48-1.755C2.114 14.573.832 11.727.832 9.203c0-2.718 1.827-4.14 3.428-4.14.826 0 1.647.264 2.324.264.71 0 1.66-.278 2.887-.278.472 0 2.074.042 3.016 1.557-.079.05-1.822 1.07-1.802 3.192.02 2.544 2.271 3.375 2.277 3.388zm-4.024-9.706c.506-.606.875-1.454.875-2.298 0-.118-.01-.238-.03-.355-.826.034-1.822.548-2.415 1.243-.448.518-.877 1.368-.877 2.216 0 .13.022.261.033.308.055.01.144.021.228.021.743 0 1.688-.505 2.186-1.135z" />
//       </svg>
//     ),
//     url: `${API_URL}/auth/apple`,
//     bg: "bg-black text-white hover:bg-neutral-900",
//   },
  {
    name: "Facebook",
    logo: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="w-6 h-6"
      >
        <path
          fill="#1877F2"
          d="M24 4C12.954 4 4 12.954 4 24c0 9.991 7.317 18.28 16.875 19.78V30.688h-5.078V24h5.078v-5.084c0-5.013 2.987-7.78 7.56-7.78 2.192 0 4.484.392 4.484.392v4.922h-2.524c-2.484 0-3.258 1.541-3.258 3.121V24h5.547l-.887 6.688h-4.66v13.09C36.683 42.28 44 33.991 44 24 44 12.954 35.046 4 24 4z"
        />
        <path
          fill="#fff"
          d="M32.813 30.688L33.7 24h-5.547v-4.429c0-1.58.774-3.121 3.258-3.121h2.524V11.53s-2.292-.392-4.484-.392c-4.573 0-7.56 2.767-7.56 7.78V24h-5.078v6.688h5.078v13.09a20.064 20.064 0 006.25 0v-13.09h4.66z"
        />
      </svg>
    ),
    url: `${API_URL}/api/auth/facebook`,
    bg: "bg-blue-600 text-white hover:bg-blue-700",
  },
];

const SocialLoginButtons = () => {
  return (
    <div className="flex justify-center gap-3 w-full max-w-sm mx-auto mt-3">
      {providers.map((p) => (
        <a
          key={p.name}
          href={p.url}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium transition ${p.bg}`}
        >
          {p.logo}
        </a>
      ))}
    </div>
  );
};

export default SocialLoginButtons;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function UserForm() {
  const { loginUser, getUserInfo, loading, error } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // appel au contexte pour login — envoi de email (champ attendu par le backend)
      const res = await loginUser({ username: email, password: password });
      // après login, récupérer les infos utilisateur protégées en passant le token
      // (avoids timing issues with state updates)
      await getUserInfo(res?.token);
      // naviguer vers le dashboard
      navigate("/dashboard");
    } catch (e) {
      // l'erreur est gérée dans le context (setError)
      console.error("Login failed", e);
    }
  };

  return (
    <div
      id="user-form"
      className="flex flex-col w-[360px] h-[540px] rounded-[20px] p-[32px] gap-[28px] bg-white shadow-sm"
    >
      <h1 className="font-semibold text-[26px] leading-tight text-[#0B23F4]">
        Transformez vos stats en résultats
      </h1>

      <div>
        <h2 className="text-[20px] pt-6 pb-4">Se connecter</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-[#707070] pb-1" htmlFor="email">
              Adresse email
            </label>
            <input
              className="border border-[#707070]/50 rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-[#0B23F4]/40"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[#707070] pb-1" htmlFor="password">
              Mot de passe
            </label>
            <input
              className="border border-[#707070]/50 rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-[#0B23F4]/40"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full h-[46px] rounded-[10px] bg-[#0B23F4] text-white font-medium hover:bg-[#091cd1] transition flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Connexion...</span>
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {error && <p className="text-red-600 text-sm mt-2">Erreur : {error}</p>}
      </div>
    </div>
  );
}

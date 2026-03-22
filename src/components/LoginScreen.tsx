import Icon from "@/components/ui/icon";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

type LoginStep = "phone" | "code" | "done";
type AuthMethod = "telegram" | "email";
type EmailMode = "login" | "register";

interface LoginScreenProps {
  loginStep: LoginStep;
  setLoginStep: (s: LoginStep) => void;
  phone: string;
  setPhone: (v: string) => void;
  code: string;
  setCode: (v: string) => void;
  authMethod: AuthMethod;
  setAuthMethod: (v: AuthMethod) => void;
  emailMode: EmailMode;
  setEmailMode: (v: EmailMode) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  displayName: string;
  setDisplayName: (v: string) => void;
  authError: string;
  setAuthError: (v: string) => void;
  authLoading: boolean;
  setAuthLoading: (v: boolean) => void;
  setCurrentUser: (u: { name: string; email: string } | null) => void;
  setLoggedIn: (v: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export default function LoginScreen({
  loginStep, setLoginStep,
  phone, setPhone,
  code, setCode,
  authMethod, setAuthMethod,
  emailMode, setEmailMode,
  email, setEmail,
  password, setPassword,
  displayName, setDisplayName,
  authError, setAuthError,
  authLoading, setAuthLoading,
  setCurrentUser, setLoggedIn, setActiveTab,
}: LoginScreenProps) {

  function handleLogin() {
    if (loginStep === "phone") {
      setLoginStep("code");
    } else if (loginStep === "code") {
      setLoginStep("done");
      setTimeout(() => { setLoggedIn(true); setActiveTab("chats"); }, 900);
    }
  }

  async function handleEmailAuth() {
    setAuthError("");
    setAuthLoading(true);
    try {
      if (emailMode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName.trim()) {
          await updateProfile(cred.user, { displayName: displayName.trim() });
        }
        setCurrentUser({ name: displayName || email.split("@")[0], email });
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        setCurrentUser({
          name: cred.user.displayName || cred.user.email?.split("@")[0] || "Пользователь",
          email: cred.user.email || email,
        });
      }
      setLoginStep("done");
      setTimeout(() => { setLoggedIn(true); setActiveTab("chats"); }, 900);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      if (code === "auth/email-already-in-use") setAuthError("Email уже зарегистрирован");
      else if (code === "auth/wrong-password" || code === "auth/invalid-credential") setAuthError("Неверный email или пароль");
      else if (code === "auth/user-not-found") setAuthError("Пользователь не найден");
      else if (code === "auth/weak-password") setAuthError("Пароль должен быть не менее 6 символов");
      else if (code === "auth/invalid-email") setAuthError("Неверный формат email");
      else if (code === "auth/too-many-requests") setAuthError("Слишком много попыток. Попробуйте позже");
      else setAuthError("Ошибка входа. Проверьте данные");
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0d1821 0%, #17212b 60%, #1a2d3d 100%)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: `${200 + i * 100}px`, height: `${200 + i * 100}px`,
            border: "1px solid rgba(42,171,238,0.06)",
            top: "50%", left: "50%", transform: "translate(-50%, -50%)"
          }} />
        ))}
      </div>

      <div className="mobile-frame flex flex-col" style={{ background: "var(--tg-bg)" }}>
        <div className="flex items-center justify-between px-6 pt-4 pb-1 text-xs shrink-0" style={{ color: "var(--tg-text)" }}>
          <span className="font-semibold">9:41</span>
          <div className="flex items-center gap-1.5">
            <Icon name="Signal" size={12} /><Icon name="Wifi" size={12} /><Icon name="Battery" size={12} />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex flex-col items-center pt-10 pb-6 px-6 shrink-0">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 relative"
              style={{ background: "linear-gradient(135deg, #1a96d4, #2AABEE)", boxShadow: "0 8px 32px rgba(42,171,238,0.4)" }}>
              <Icon name="Zap" size={36} color="white" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "var(--tg-green)", border: "2px solid var(--tg-bg)" }}>
                <Icon name="Check" size={12} color="white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--tg-text)" }}>NeMAX</h1>
            <p className="text-sm mt-1 text-center" style={{ color: "var(--tg-text-muted)" }}>Безопасный мессенджер с AI-ботом</p>
          </div>

          {loginStep === "done" ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(76,175,118,0.15)", border: "2px solid var(--tg-green)" }}>
                <Icon name="Check" size={30} color="var(--tg-green)" />
              </div>
              <p className="text-lg font-semibold text-center" style={{ color: "var(--tg-text)" }}>Добро пожаловать!</p>
              <p className="text-sm text-center" style={{ color: "var(--tg-text-muted)" }}>Загружаем ваши данные...</p>
              <div className="flex gap-1.5 mt-2">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--tg-blue)", animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>
          ) : (
            <div className="px-5 flex-1">
              <div className="flex rounded-2xl p-1 mb-5" style={{ background: "var(--tg-surface)" }}>
                {(["telegram", "email"] as AuthMethod[]).map(method => (
                  <button key={method} onClick={() => { setAuthMethod(method); setAuthError(""); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                    style={{
                      background: authMethod === method ? "var(--tg-blue)" : "transparent",
                      color: authMethod === method ? "white" : "var(--tg-text-muted)",
                    }}>
                    <Icon name={method === "telegram" ? "Send" : "Mail"} size={14} />
                    {method === "telegram" ? "Telegram" : "Email"}
                  </button>
                ))}
              </div>

              {authMethod === "telegram" ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-3">
                    <p className="text-sm font-medium" style={{ color: "var(--tg-text-muted)" }}>
                      {loginStep === "phone" ? "Введите номер телефона" : "Введите код из Telegram"}
                    </p>
                    {loginStep === "phone" ? (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: "var(--tg-surface)", border: "1.5px solid var(--tg-border)" }}>
                        <span className="text-sm font-semibold" style={{ color: "var(--tg-text)" }}>🇷🇺 +7</span>
                        <div className="w-px h-5" style={{ background: "var(--tg-border)" }} />
                        <input type="tel" placeholder="(999) 999-99-99" value={phone} onChange={e => setPhone(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleLogin()}
                          className="flex-1 text-sm outline-none bg-transparent" style={{ color: "var(--tg-text)" }} />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {[0, 1, 2, 3, 4].map(i => (
                          <input key={i} type="text" maxLength={1} value={code[i] || ""}
                            onChange={e => { const c = code.split(""); c[i] = e.target.value; setCode(c.join("")); }}
                            className="w-12 h-12 text-center text-lg font-bold rounded-xl outline-none"
                            style={{ background: "var(--tg-surface)", border: "1.5px solid var(--tg-border)", color: "var(--tg-text)" }} />
                        ))}
                      </div>
                    )}
                    {loginStep === "code" && (
                      <p className="text-xs text-center" style={{ color: "var(--tg-text-muted)" }}>
                        Код отправлен на +7 {phone}. <span style={{ color: "var(--tg-blue)" }} className="cursor-pointer">Не получили?</span>
                      </p>
                    )}
                  </div>
                  <button onClick={handleLogin}
                    className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-95 flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #1a96d4, #2AABEE)", color: "white" }}>
                    <Icon name={loginStep === "phone" ? "Send" : "Check"} size={18} color="white" />
                    {loginStep === "phone" ? "Получить код" : "Подтвердить"}
                  </button>
                  {loginStep === "phone" && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px" style={{ background: "var(--tg-border)" }} />
                      <span className="text-xs" style={{ color: "var(--tg-text-muted)" }}>или войдите через QR</span>
                      <div className="flex-1 h-px" style={{ background: "var(--tg-border)" }} />
                    </div>
                  )}
                  {loginStep === "phone" && (
                    <button className="w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                      style={{ background: "var(--tg-surface)", color: "var(--tg-text)", border: "1px solid var(--tg-border)" }}>
                      <Icon name="QrCode" size={16} color="var(--tg-text-muted)" />
                      Войти по QR-коду
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex rounded-xl p-0.5 mb-1" style={{ background: "var(--tg-surface)" }}>
                    {(["login", "register"] as EmailMode[]).map(mode => (
                      <button key={mode} onClick={() => { setEmailMode(mode); setAuthError(""); }}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: emailMode === mode ? "rgba(42,171,238,0.18)" : "transparent",
                          color: emailMode === mode ? "var(--tg-blue)" : "var(--tg-text-muted)",
                        }}>
                        {mode === "login" ? "Войти" : "Регистрация"}
                      </button>
                    ))}
                  </div>

                  {emailMode === "register" && (
                    <input type="text" placeholder="Имя" value={displayName} onChange={e => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                      style={{ background: "var(--tg-surface)", border: "1.5px solid var(--tg-border)", color: "var(--tg-text)" }}
                    />
                  )}
                  <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                    style={{ background: "var(--tg-surface)", border: "1.5px solid var(--tg-border)", color: "var(--tg-text)" }}
                  />
                  <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleEmailAuth()}
                    className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
                    style={{ background: "var(--tg-surface)", border: "1.5px solid var(--tg-border)", color: "var(--tg-text)" }}
                  />

                  {authError && (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl animate-fade-in"
                      style={{ background: "rgba(229,57,53,0.1)", border: "1px solid rgba(229,57,53,0.25)" }}>
                      <Icon name="AlertCircle" size={14} color="var(--tg-red)" />
                      <p className="text-xs font-medium" style={{ color: "var(--tg-red)" }}>{authError}</p>
                    </div>
                  )}

                  <button onClick={handleEmailAuth} disabled={authLoading}
                    className="w-full py-3.5 rounded-2xl font-semibold text-base transition-all active:scale-95 flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #1a96d4, #2AABEE)", color: "white", opacity: authLoading ? 0.7 : 1 }}>
                    {authLoading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Загрузка...</span>
                      </>
                    ) : (
                      emailMode === "login" ? "Войти" : "Создать аккаунт"
                    )}
                  </button>

                  {emailMode === "login" && (
                    <p className="text-center text-xs" style={{ color: "var(--tg-text-muted)" }}>
                      <span style={{ color: "var(--tg-blue)" }} className="cursor-pointer">Забыли пароль?</span>
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 p-3 rounded-xl" style={{ background: "rgba(42,171,238,0.07)", border: "1px solid rgba(42,171,238,0.18)" }}>
                <Icon name="Lock" size={13} color="#2AABEE" />
                <p className="text-xs" style={{ color: "var(--tg-text-muted)" }}>Данные шифруются E2E. Мы не храним пароли.</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 pb-5 text-center shrink-0">
          <p className="text-xs" style={{ color: "var(--tg-text-muted)" }}>
            Продолжая, вы соглашаетесь с <span style={{ color: "var(--tg-blue)" }}>условиями использования</span>
          </p>
        </div>
      </div>
    </div>
  );
}

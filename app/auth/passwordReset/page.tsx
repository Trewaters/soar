export default function PasswordRecoveryPage() {
  return (
    <div>
      <h1>Password Recovery</h1>
      <p>
        Forgot your password? No problem! Enter your email and we&lsquo;ll send
        you a temporary password.
      </p>
      <form>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <button type="submit">Send Temporary Password</button>
      </form>
    </div>
  )
}

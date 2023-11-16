import { useRouter } from "next/navigation";
const Nav = () => {
  const router = useRouter();

  return (
    <div className="w-1/2">
      <ul>
        <li onClick={() => router.push("/")}>Home</li>
        <li onClick={() => router.push("/auth/register")}>Register</li>
        <li onClick={() => router.push("/auth/login")}>Login</li>
      </ul>
    </div>
  );
};

export default Nav;

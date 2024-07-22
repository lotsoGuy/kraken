import {getUser} from "@/actions/userActions";
import LogoutButton from "@/app/login/LogoutButton";


export default async function  Home() {
    const user = await getUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
     <h1>Hello guys</h1>
        { user.length === 0 ? <p>No user found</p> :
        <div className="flex flex-col">
        {user.map((user) => (
            // eslint-disable-next-line react/jsx-key
            <div className="flex flex-col">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            </div>
        ))}
         <LogoutButton/>
        </div>}
    </main>
  );
}

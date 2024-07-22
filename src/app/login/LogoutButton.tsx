import {logout} from "@/actions/auth/auth";


export default function LogoutButton() {

    return (
        <form action={logout}>
            <button type="submit" className={"text-sm mt-5 bg-red-500 py-3 w-full rounded-3xl  text-white flex justify-center items-center"}>
                Logout
            </button>
        </form>

    );
}
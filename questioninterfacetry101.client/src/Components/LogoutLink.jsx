import { useNavigate } from "react-router-dom";

function LogoutLink(props) {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();

        localStorage.removeItem('jwtToken');
        sessionStorage.removeItem('jwtToken');

        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: ""
        })
            .then((data) => {
                navigate("/login");
            })
            .catch((error) => {
                console.error("Error during logout:", error);
                navigate("/login");
            });
    };

    return (
        <a href="#" onClick={handleLogout}>{props.children}</a>
    );
}

export default LogoutLink;

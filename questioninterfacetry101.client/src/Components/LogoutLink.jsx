import { useNavigate } from "react-router-dom";

function LogoutLink(props) {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: ""
        })
            .then((data) => {
                if (data.ok) {
                    navigate("/login");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <a href="#" onClick={handleSubmit}>Logout</a>
    );
}

export default LogoutLink;

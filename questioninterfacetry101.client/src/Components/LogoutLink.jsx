import { useNavigate } from "react-router-dom";
//remove the jwt when loged out
function LogoutLink(props) {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`, 
            },
            body: ""
        })
            .then((data) => {
                if (data.ok) {
                    localStorage.removeItem('token');
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

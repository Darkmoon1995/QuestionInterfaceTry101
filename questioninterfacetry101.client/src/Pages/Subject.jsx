
import CustomButton from "../Components/CustomButton.jsx"

function Home() {
    return (
        <div className="button-container">
            <CustomButton value1="Math" value2="100Questions" value3="home" />
            <CustomButton value1="Science" value2="100Questions" value3="subject" />
            <CustomButton value1="Geography" value2="100Questions" value3="contact" />
        </div>
    );
}

export default Home;
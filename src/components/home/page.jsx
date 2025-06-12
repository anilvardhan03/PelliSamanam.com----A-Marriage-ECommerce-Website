import { useEffect, useState } from "react";
import axios from "axios";

const HomePage = () => {
    const logoUrl = process.env.REACT_APP_LOGO_URL;
    const coordinatesUrl = process.env.REACT_APP_GEOLOCATION_URL;
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const locationUrl = process.env.REACT_APP_GEOCODE_URL;
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [address, setAddress] = useState({});
    const [isaddressLoaded, setAddressLoaded] = useState(false);

    const fetchFullAddress = async () => {
        try {
            const response = await axios.get(
                `${locationUrl}?latlng=${latitude},${longitude}&key=${apiKey}`
            );
            const result = response.data.results[0];
            const components = result.address_components;

            const address = {
                doorNo: "",
                street: "",
                cityOrVillage: "",
                mandal: "",
                state: "",
                postalCode: "",
                country: ""
            };

            components.forEach(component => {
                if (component.types.includes("street_number")) address.doorNo = component.long_name;
                if (component.types.includes("route")) address.street = component.long_name;
                if (component.types.includes("locality")) address.cityOrVillage = component.long_name;
                if (component.types.includes("administrative_area_level_2")) address.mandal = component.long_name;
                if (component.types.includes("administrative_area_level_1")) address.state = component.long_name;
                if (component.types.includes("postal_code")) address.postalCode = component.long_name;
                if (component.types.includes("country")) address.country = component.long_name;
            });
            setAddress(address);
            setAddressLoaded(true)
        } catch (error) {
            console.error("Error fetching address:", error);
            return null;
        }
    };

    function getCordinates() {
        axios
            .post(`${coordinatesUrl}?key=${apiKey}`)
            .then((response) => {
                setLatitude(response.data.location.lat);
                setLongitude(response.data.location.lng);
            })
            .catch((err) => console.log("Geo Error:", err));
    }

    useEffect(() => {
        getCordinates();
    }, []);
    return (
        <div className="" style={{ backgroundColor: "#FFFFFF", minHeight: "100vh", fontFamily: 'times-new-roman' }}>
            <div className="d-flex border-bottom w-100 px-5">
                <div className="p-1 border-end pe-5">
                    <img className="img-thumbnail" src={logoUrl} alt="logo" width={100} />
                </div> {/* Icon */}
                <div className="p-2 ms-4">
                    <button className="ms-4 btn btn-warning fw-bold" onClick={fetchFullAddress} style={{ width: "180px", height : "30px" }}>
                        {isaddressLoaded ? <span>Your Location </span> : <span>Detect My Location</span>}
                    </button>
                    <div className="d-flex align-items-center me-4">
                        <span className="mt-2 bi bi-geo-alt-fill fs-4 text-danger"></span>
                        <div className="mt-2 border border-secondary shadow-sm rounded-2 px-1" style={{ backgroundColor: "#f8f9fa", width: "180px", height : "30px" }}>
                            {
                                isaddressLoaded
                                    ? <span className="text-wrap">{address.cityOrVillage} , {address.state} </span>
                                    : <span className="text-nowrap">Your Address Appears here..</span>
                            }
                        </div>
                    </div>
                </div> {/* Location*/}
                <div className="">
                    <div className="ms-5 mt-3 border border-secondary shadow-sm rounded-4 px-1 align-content-center me-5" style={{ backgroundColor: "#f8f9fa", width: "600px", height: "50px" }}>
                        <span className="ms-4 bi bi-search"></span><input className="ms-2 rounded-1" style={{width:"520px", border:"none", outline : "none", backgroundColor : "#f8f9fa" }}></input>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

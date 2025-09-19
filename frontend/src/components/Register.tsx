import React, {useState} from "react";

interface RegisterProps {
    onRegister: (token: string, user: any) => void;
    switchtoLogin:() => void;
}

function Register({onRegister, switchtoLogin}:RegisterProps){
    const [name,setname] = useState('');
    const [email,setemail] = useState('');
    const [password, setpassword] = useState('');
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState('');

    const handlSubmit = async(e:React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/api/auth/register`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });
            if (response.ok) {

                console.log("Sucesfully Registered");
                switchtoLogin();


            }
            else {
                const errorData = await response.json();
                seterror(errorData.erroData || 'Failed to Register')
            }
        } catch(error){
            console.log("Unable to register", error)
        }
    }
    return(
        <form onSubmit={handlSubmit}>
            {error && <div style={{color: 'red'}}>{error}</div>}
            <input 
            type="text"
            value = {name}
            onChange={(e)=>setname(e.target.value)}
            placeholder="name"
            />
            <input 
            type="email" 
            value={email} 
            onChange={(e) => setemail(e.target.value)}
            placeholder="Email" 
        />
        <input 
            type="password" 
            value={password} 
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Password" 
        />
        <button type="submit">Register</button>
        </form>
    )

}

export default Register;
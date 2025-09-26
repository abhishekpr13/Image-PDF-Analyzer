import React, {useState} from "react";

interface LoginProps {
    onLogin: (token: string,user: any) => void;
    switchtoRegister:() =>void;
}

function Login({onLogin,switchtoRegister}:LoginProps){
    const [email,setemail]= useState('');
    const [password,setpassword] = useState('');
    const [loading,setloading] = useState(true);
    const [error, seterror] = useState('');

    const handlSubmit = async(e:React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8000/api/auth/login`,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        if(response.ok) {
            const result = await response.json();
            console.log("Sucesfully Loggedin ");
            const token = result.token;
            const user = result.user;

            onLogin(token,user);
        } else {
            const errorData = await response.json();

            seterror(errorData.erroData|| 'login Failed')
        }
        }catch(error){
            console.log("login Failed",error)
        }
    }
    return (
    <form onSubmit={handlSubmit}>
        {error && <div style={{color: 'red'}}>{error}</div>}
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
        <button type="submit">Login</button>
    </form>
);


}

export default Login;


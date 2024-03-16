const handleSignIn = async (values) => {
    console.log('form values: ', values);
    if (values) {
        localStorage.setItem('Auth', true); /* you can change this according to your authentication protocol */
        window.location.replace('/dashboard/home');
    }
}

export default handleSignIn;
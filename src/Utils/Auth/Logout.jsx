const handleLogOut = () => {
    localStorage.removeItem('Auth');
    window.location.replace('/signin');
}

export default handleLogOut;
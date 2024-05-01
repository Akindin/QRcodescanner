import logo from '../img/logo512.png';

export default function Header() {
    return (
        <header>
            <img src={logo} alt="QR Code Scanner" />
            <div className="logo">
                <p className="logo-text">QR Code Scanner</p>
            </div>
        </header>
    )
}
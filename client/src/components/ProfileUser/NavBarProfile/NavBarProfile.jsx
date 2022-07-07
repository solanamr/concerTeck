import React from 'react';
import style from './NavBarProfile.module.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logoSombra from '../../../assets/Logo-png.png';
import PerfilYLogoutAuth0 from '../../LogoutAuth0/PerfilYLogoutAuth0';
import { BsFillStarFill } from 'react-icons/bs';

export default function NavBarProfile () {

    const user = useSelector(state => state.User);
    const userdates = JSON.parse(localStorage.getItem("userdates"))
    console.log(userdates,"EXTRAIDOS")

    return(<div className={style.containerNavBarProfile}>
         <Link to="/">
          <img className={style.logo} src={logoSombra} alt="Logo not found" />
        </Link>
        <Link to='/favs' style={{ textDecoration: "none" }}>
            <span className={style.titleData2}><BsFillStarFill size={15}/> Favoritos </span>
        </Link>
            <span className={style.titleData}>Nombre: {userdates.name}</span>
         <PerfilYLogoutAuth0/>
    </div>)
}
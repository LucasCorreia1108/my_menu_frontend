import styles from "./footer.module.css";
import { Link } from "react-router-dom";
import { scrollToTop } from "../../utils/scrollToTop";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.brandBlock}>
          <img src="/logo_mymenu.png" alt="MyMenu logo" />
          <div>
            <h2>MyMenu</h2>
            <p>Sabores autênticos, atendimento aconchegante e estilo italiano moderno.</p>
          </div>
        </div>

        <div className={styles.linksBlock}>
          <h3>Explorar</h3>
          <Link className={styles.link} to="/" onClick={scrollToTop}>Home</Link>
          <Link className={styles.link} to="/plates" onClick={scrollToTop}>Cardápio</Link>
          <Link className={styles.link} to="/profile" onClick={scrollToTop}>Perfil</Link>
        </div>

        <div className={styles.infoBlock}>
          <h3>Contato</h3>
          <p>Feito por Lucas Correia</p>
          <a className={styles.link} href="https://www.linkedin.com/in/lucascorreia-dev/" target="_blank" rel="noreferrer">Veja meus projetos!</a>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>© 2024 MyMenu. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

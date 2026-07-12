import styles from "./home.module.css";
import { FaInstagram, FaFacebookSquare, FaWhatsapp, FaMapMarkerAlt, FaPizzaSlice, FaUtensils, FaCookieBite, FaCocktail } from "react-icons/fa";
import { GiNoodles } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import usePlatesServices from "../../services/plates";
import Loading from "../loading/loading";
import About from "../../page/about/about";

export default function Home() {
  const navigate = useNavigate();
  const { getPlates, plateLoading, refetchPlates, platesList } = usePlatesServices();
  useEffect(() => {
    if (refetchPlates && !platesList.length) {
      getPlates();
    }
  }, [refetchPlates, platesList.length, getPlates]);

  const featuredPlates = platesList.slice(0, 3);

  if (plateLoading && !featuredPlates.length) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.pageContainer}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Cucina Italiana</span>
            <h1>
              Sabores autênticos da <span>Itália</span> em cada prato.
            </h1>
            <p>
              Ingredientes selecionados, receitas tradicionais e o verdadeiro amor pela gastronomia italiana.
            </p>
            <div className={styles.heroButtons}>
              <button onClick={() => navigate("/plates")}>Ver Cardápio</button>
              <button className={styles.secondaryButton} onClick={() => navigate("/plates")}>Fazer Pedido</button>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <img src="/imgs/massa-pomodoro.jpg" alt="Massa Bolonhesa" />
            </div>
          </div>
        </section>

        <section className={styles.categoriesSection}>
          <div className={styles.categoriesTitle}>
            <p>Explore nosso cardápio</p>
          </div>
          <div className={styles.categoriesGrid}>
            <div className={styles.categoryItem}>
              <FaPizzaSlice />
              <span>Pizzas</span>
            </div>
            <div className={styles.categoryItem}>
              <GiNoodles />
              <span>Massas</span>
            </div>
            <div className={styles.categoryItem}>
              <FaUtensils />
              <span>Entradas</span>
            </div>
            <div className={styles.categoryItem}>
              <FaCookieBite />
              <span>Sobremesas</span>
            </div>
            <div className={styles.categoryItem}>
              <FaCocktail />
              <span>Bebidas</span>
            </div>
          </div>
        </section>
        <About/>
        <section className={styles.featuredSection}>
          <div className={styles.sectionTitle}>
            <h2>Destaques da casa</h2>
          </div>
          <div className={styles.productCards}>
            {featuredPlates.map((plate) => (
              <article key={plate._id} className={styles.productCard}>
                <div className={styles.productImage}>
                  {plate.imgUrl ? (
                    <img src={plate.imgUrl} alt={plate.name} />
                  ) : (
                    <img src="/imgs/massa-pomodoro.jpg" alt="Prato especial" />
                  )}
                </div>
                <div className={styles.productCardContent}>
                  <h3>{plate.name}</h3>
                  <p>{plate.description}</p>
                  <span>R$ {Number(plate.price || 0).toFixed(2)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.storySection}>
          <div className={styles.storyContent}>
            <p>La nostra storia</p>
            <h2>Tradição que se sente em cada detalhe</h2>
            <p>
              Mais que um restaurante, uma experiência italiana. Aqui, cada prato conta
              uma história passada de geração em geração.
            </p>
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>Sobre Nós</button>
          </div>
        </section>

        <section className={styles.contactSection}>
          <h2>Fique por dentro</h2>
          <p>
            Siga nossas redes e receba novidades sobre pratos especiais, promoções e eventos.
          </p>
          <div className={styles.socialButtonsContainer}>
            <button className={styles.socialButton}><FaInstagram /> Instagram</button>
            <button className={styles.socialButton}><FaFacebookSquare /> Facebook</button>
            <button className={styles.socialButton}><FaWhatsapp /> Whatsapp</button>
            <button className={styles.socialButton}><FaMapMarkerAlt /> Localização</button>
          </div>
        </section>
      </div>
    </>
  );
}

import styles from "./about.module.css";

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.content}>
        <span className={styles.tag}>Sobre Nós</span>

        <h2>
          Mais do que refeições,
          <br />
          criamos experiências.
        </h2>

        <p>
          No My Menu, acreditamos que uma boa refeição vai além do prato.
          Com ingredientes selecionados, receitas inspiradas na culinária
          italiana e um atendimento acolhedor, oferecemos momentos especiais
          para cada cliente.
        </p>

        <div className={styles.stats}>
          <div>
            <strong>+500</strong>
            <span>Pedidos entregues</span>
          </div>

          <div>
            <strong>100%</strong>
            <span>Ingredientes frescos</span>
          </div>

          <div>
            <strong>4.9★</strong>
            <span>Avaliação média</span>
          </div>
        </div>
      </div>
    </section>
  );
}
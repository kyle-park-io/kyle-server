import { type Component, type JSX } from 'solid-js';
// styles
import './About.css';

/**
 * About Page Component
 * New York Times inspired elegant about page design
 * Clean typography with professional layout
 */
const About: Component = (): JSX.Element => {
  return (
    <div class="about-page">
      {/* Main Content */}
      <div class="about-container">
        {/* Introduction Section */}
        <section class="about-section">
          <h2 class="about-section__title">Introduction</h2>
          <div class="about-section__content">
            <p>
              Welcome to my personal website. This platform serves as a space
              for practicing orchestration techniques and showcasing personal
              projects.
            </p>
            <p>
              All code, development documentation, and resources are freely
              available for reference and sharing. I hope this inspires
              continuous development and collaboration within the community.
            </p>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section class="about-section">
          <h2 class="about-section__title">Tech Stack</h2>
          <div class="about-section__content">
            <p class="about-tech__intro">
              This website is built with modern technologies and best practices:
            </p>

            <div class="about-tech__grid">
              {/* Infrastructure */}
              <div class="about-tech__card">
                <div class="about-tech__card-icon">☁️</div>
                <h3 class="about-tech__card-title">Infrastructure</h3>
                <ul class="about-tech__list">
                  <li>GKE (Google Kubernetes Engine)</li>
                  <li>Kubernetes</li>
                  <li>Docker</li>
                  <li>Nginx Ingress</li>
                </ul>
              </div>

              {/* Backend - Go */}
              <div class="about-tech__card">
                <div class="about-tech__card-icon">🔧</div>
                <h3 class="about-tech__card-title">Backend (Go)</h3>
                <ul class="about-tech__list">
                  <li>net/http</li>
                  <li>Gorilla WebSocket</li>
                  <li>gRPC</li>
                  <li>Redis</li>
                </ul>
              </div>

              {/* Backend - Node.js */}
              <div class="about-tech__card">
                <div class="about-tech__card-icon">⚡</div>
                <h3 class="about-tech__card-title">Backend (Node.js)</h3>
                <ul class="about-tech__list">
                  <li>Express.js</li>
                  <li>TypeScript</li>
                  <li>MongoDB</li>
                  <li>REST API</li>
                </ul>
              </div>

              {/* Frontend */}
              <div class="about-tech__card">
                <div class="about-tech__card-icon">🎨</div>
                <h3 class="about-tech__card-title">Frontend</h3>
                <ul class="about-tech__list">
                  <li>SolidJS</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Webpack</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section class="about-section">
          <h2 class="about-section__title">Projects</h2>
          <div class="about-section__content">
            <p>
              For detailed technical specifications of individual projects,
              please refer to each project's dedicated About section on the main
              page.
            </p>
            <p>
              Each project showcases different aspects of full-stack
              development, from blockchain integrations to real-time
              communication systems.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section class="about-section about-section--contact">
          <h2 class="about-section__title">Get in Touch</h2>
          <div class="about-section__content">
            <p class="about-contact__intro">
              I'm always open to discussing technology, collaboration
              opportunities, or just having a friendly chat. Feel free to reach
              out through any of the following channels:
            </p>

            <div class="about-contact__grid">
              <a href="mailto:andy3638@naver.com" class="about-contact__item">
                <span class="about-contact__icon">✉️</span>
                <span class="about-contact__label">Email</span>
                <span class="about-contact__value">andy3638@naver.com</span>
              </a>

              <a
                href="https://www.linkedin.com/in/kyle-park-io"
                target="_blank"
                rel="noopener noreferrer"
                class="about-contact__item"
              >
                <span class="about-contact__icon">💼</span>
                <span class="about-contact__label">LinkedIn</span>
                <span class="about-contact__value">kyle-park-io</span>
              </a>

              <a
                href="https://github.com/kyle-park-io"
                target="_blank"
                rel="noopener noreferrer"
                class="about-contact__item"
              >
                <span class="about-contact__icon">🐙</span>
                <span class="about-contact__label">GitHub</span>
                <span class="about-contact__value">kyle-park-io</span>
              </a>

              <a
                href="https://t.me/kyleparkio"
                target="_blank"
                rel="noopener noreferrer"
                class="about-contact__item"
              >
                <span class="about-contact__icon">💬</span>
                <span class="about-contact__label">Telegram</span>
                <span class="about-contact__value">@kyleparkio</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

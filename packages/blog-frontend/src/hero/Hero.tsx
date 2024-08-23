import { type Component, type JSX } from 'solid-js';
import { Carousel } from 'solid-bootstrap';
// image
// import Gopher1 from '/gopher1-bg.webp?url';
// import Gopher2 from '/gopher2-bg.jpg?url';
// import Dex from '/dex-bg.webp?url';
import Gopher1 from '@public/gopher1-bg.webp';
import Gopher2 from '@public/gopher2-bg.jpg';
import Bitcoin from '@public/bitcoin-bg.jpg';
// import Dex from '@public/dex-bg.webp';
// css
import './Hero.css';
import { globalState } from '../constants/constants';

const Hero: Component = (): JSX.Element => {
  const handleDexClick = (): void => {
    window.location.href = `${globalState.url}/dex`;
  };

  return (
    <>
      <div class="tw-w-full">
        <Carousel fade interval={30000} variant="dark">
          <Carousel.Item onClick={handleDexClick} class="tw-cursor-pointer">
            <div class="d-block w-100 bg-secondary d-flex justify-content-center align-items-center responsive-height">
              <img
                src={Bitcoin}
                alt="Bitcoin"
                class="tw-h-full tw-max-w-full"
              ></img>
            </div>
            <Carousel.Caption>
              <h2>Dex</h2>
              <p>Go to Project</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <div class="d-block w-100 bg-secondary d-flex justify-content-center align-items-center responsive-height">
              <img
                src={Gopher1}
                alt="Gopher1"
                class="tw-h-full tw-max-w-full"
              ></img>
            </div>
            <Carousel.Caption>
              <h2>Golang</h2>
              <p>kyle-park-io</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <div class="d-block w-100 bg-secondary d-flex justify-content-center align-items-center responsive-height">
              <img
                src={Gopher2}
                alt="Gopher1"
                class="tw-h-full tw-max-w-full"
              ></img>
            </div>
            <Carousel.Caption>
              <h2>Golang</h2>
              <p>kyle-park-io</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </>
  );
};

export default Hero;

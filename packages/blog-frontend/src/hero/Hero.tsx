import { type Component, type JSX } from 'solid-js';
import { Carousel } from 'solid-bootstrap';
// image
// import Gopher1 from '/gopher1-bg.webp?url';
// import Gopher2 from '/gopher2-bg.jpg?url';
// import Dex from '/dex-bg.webp?url';
import Gopher1 from '@public/gopher1-bg.webp';
import Gopher2 from '@public/gopher2-bg.jpg';
import Dex from '@public/dex-bg.webp';

const Hero: Component = (): JSX.Element => {
  return (
    <>
      <div class="tw-w-full">
        <Carousel fade interval={30000}>
          <Carousel.Item>
            <div
              class="d-block w-100 bg-secondary d-flex justify-content-center align-items-center"
              style={{ height: '500px' }}
            >
              <img src={Gopher1} alt="Gopher1" class="tw-h-full"></img>
            </div>
            <Carousel.Caption>
              <h2>Golang</h2>
              <p>Blah Blah Blah</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <div
              class="d-block w-100 bg-secondary d-flex justify-content-center align-items-center"
              style={{ height: '500px' }}
            >
              <img src={Gopher2} alt="Gopher1" class="tw-h-full"></img>
            </div>
            <Carousel.Caption>
              <h2>Golang</h2>
              <p>Blah Blah Blah</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <div
              class="d-block w-100 bg-secondary d-flex justify-content-center align-items-center"
              style={{ height: '500px' }}
            >
              <img src={Dex} alt="Gopher1" class="tw-h-full"></img>
            </div>
            <Carousel.Caption>
              <h2>Dex</h2>
              <p>Blah Blah Blah</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </>
  );
};

export default Hero;

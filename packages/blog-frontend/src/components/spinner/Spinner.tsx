import { type Component, type JSX } from 'solid-js';

// spinner css
import './Spinner.css';

const Spinner: Component = (): JSX.Element => {
  return (
    <>
      <div class="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default Spinner;

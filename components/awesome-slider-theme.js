import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';

const AutoplaySlider = withAutoplay(AwesomeSlider);

const CustomSlider = ({ children }) => {
  return (
    <AutoplaySlider
      play={true}
      cancelOnInteraction={false} // should stop playing on user interaction
      interval={6000}
      bullets={true}
      cssModule={{
        container: {
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        content: {
          backgroundColor: 'transparent', // Change the background color
        },
        bullets: {
          active: {
            backgroundColor: '#4a5568', // Change active bullet color
          },
        },
      }}
      style={{
        '--slider-height-percentage': '50%',
        '--slider-transition-duration': '770ms',
        '--organic-arrow-thickness': '4px',
        '--organic-arrow-border-radius': '0px',
        '--organic-arrow-height': '30px',
        '--organic-arrow-color': '#f44336',
        '--control-button-width': '10%',
        '--control-button-height': '25%',
        '--control-button-background': 'rgba(0, 0, 0, 0.1)',
        '--control-bullet-color': '#f44336',
        '--control-bullet-active-color': '#ff5722',
        '--loader-bar-color': '#ff5722',
        '--loader-bar-height': '6px',
      }}
    >
      {children}
    </AutoplaySlider>
  );
};

export default CustomSlider;

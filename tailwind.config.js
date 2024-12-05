module.exports = {
  content: ["./views/**/*.handlebars", "./routes/**/*.js"],
  theme: {
    extend: {
      animation: {
        'fall-quick': 'fallIn 1s ease-in-out forwards',
        'fall-1': 'fallIn 1s ease-out forwards',
        'fall-2': 'fallIn 1s ease-out 0.75s forwards',
        'fall-3': 'fallIn 1s ease-out 1.5s forwards',
        'fall-4': 'fallIn 1s ease-out 2.25s forwards',
        'fall-5': 'fallIn 1s ease-out 3s forwards',
        'fall-6': 'fallIn 1s ease-out 3.75s forwards',
        'fall-7': 'fallIn 1s ease-out 4.5s forwards',
        'forms-1': 'fallIn 1s ease-out 0.9s forwards',
        'forms-2': 'fallIn 1s ease-out 1.0s forwards',
        'forms-3': 'fallIn 1s ease-out 1.1s forwards',
        'forms-4': 'fallIn 1s ease-out 1.2s forwards',
        'forms-5': 'fallIn 1s ease-out 1.3s forwards',
        'forms-6': 'fallIn 1s ease-out 1.4s forwards',
        'forms-7': 'fallIn 1s ease-out 1.5s forwards',
        'forms-8': 'fallIn 1s ease-out 1.6s forwards',
        'forms-9': 'fallIn 1s ease-out 1.7s forwards',
        'forms-10': 'fallIn 1s ease-out 1.8s forwards',
        'forms-11': 'fallIn 1s ease-out 1.9s forwards',
        'forms-12': 'fallIn 1s ease-out 2s forwards',
        'button-1': 'fallIn 1s ease-out 2.35s forwards',
        'button-2': 'fallIn 1s ease-out 2.45s forwards',
        'fade-in': 'fadeIn 1s ease-out 1.5s forwards',
        'fade-in-instant': 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        fallIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-100px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      translate: {
        '1/5': '20%',
        '1/4': '25%',
        '1/3': '33.333333%',
        '1/2': '50%',
        '2/3': '66.666667%',
        '3/4': '75%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '-1/5': '-20%',
        '-1/4': '-25%',
        '-1/3': '-33.333333%',
        '-1/2': '-50%',
        '-2/3': '-66.666667%',
        '-3/4': '-75%',
        '-4/5': '-80%',
      },
    }
  },
  plugins: [],
};

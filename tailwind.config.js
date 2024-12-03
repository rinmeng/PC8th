module.exports = {
  content: ["./views/**/*.handlebars", "./routes/**/*.js"],
  theme: {
    extend: {
      animation: {
        'fall-1': 'fallIn 1s ease-out forwards',
        'fall-2': 'fallIn 1s ease-out 0.75s forwards',
        'fall-3': 'fallIn 1s ease-out 1.5s forwards',
        'fall-4': 'fallIn 1s ease-out 2.25s forwards',
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

import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    didTransition() {
      var controller = this.controllerFor('userDash');

      controller.listOfCompanies = [];

      // Get list of all companies
      var promise = new Promise((resolve, reject) => {
        var data = controller.get('firebaseApp').database().ref().child('users/');
        data.on('value', (snapshot) => {
          for (let val of Object.values(snapshot.val())) {
            if (val.company === true) {
              controller.listOfCompanies.push(val);
            } else {
              continue;
            }
          }
          resolve();
        }, (error) => {
          Error(error);
          reject();
        });
      });

      promise.then(() => {
        var promise12 = new Promise((resolve, reject) => {
          var el = $(document.querySelector('.mainBox'));
          resolve(el);
        });
        promise12.then((el) => {
          var promise2 = new Promise((resolve, reject) => {
            for (var i = 0; i < controller.listOfCompanies.length; i++) {
              el.append('<a data-uid="' + controller.listOfCompanies[i].uid + '" class="boxCompany">' + controller.listOfCompanies[i].name + '</a>');
            }
            resolve();
          });
          promise2.then(() => {
            var promise3 = new Promise((resolve, reject) => {
              $('.boxCompany').on('click', (event) => {
                var redircN;
                var promise11 = new Promise((resolve, reject) => {
                  redircN = event.target.dataset.uid;
                  resolve();
                });
                promise11.then(() => {
                  controller.transitionToRoute('user-calendar', {
                    queryParams: {
                      cN: redircN
                    }
                  });
                });
              });
              resolve();
            });
            promise3.then(() => {
              $('.boxCompany').css('transition', 'all .2s');
              $('.boxCompany').css('opacity', '1');
            });
          });
        });

      });

      return true; // Bubble the didTransition event
    }
  }
});

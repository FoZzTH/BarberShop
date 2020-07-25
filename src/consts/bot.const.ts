export const startMessage = 'Choose what to do or type /help:';
export const dontUnderstand = 'What did you say? Try type /help next time...';
export const cancelMessage = 'Ok, I forgot what happened between us.';

//  --------------- Appointment ----------------

export const enterEmail = 'Enter email for notification.'; 
export const chooseService = 'Now, choose what kind of service you need:';

export const haircutService = 'Haircut.';
export const shavingService = 'Shaving.';
export const haircutAndShavingService = 'Haircut & shaving.';

export const serviceSelected = 'Service(s) selected.';

export const serviceKeyboard = {
  reply_markup: {
    keyboard: [[haircutService, shavingService], [haircutAndShavingService]],
  },
};

export const hideKeyboard = {
  reply_markup: {
    remove_keyboard: true,
  }
};

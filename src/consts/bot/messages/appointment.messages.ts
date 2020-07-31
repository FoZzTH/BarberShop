import {
  create,
  service,
  date,
  email,
  master,
  show,
  time,
} from '../commands/appointment.commands';
import { cancel } from '../commands/sceneSwap.commands';

export const enterMessage = `To make an appointment need to choose and set :
1. /${email} - your email;
2. /${service} - type of service you need (haircut, shaving, both);
3. /${date} - date of appointment (Format: '');
4. /${time} - time of appointment (Format: '');
5. /${master} - a master (/list to see the list).
Type /${show} to see info about current appointment.
Type /${create} to create appointment.
Type /${cancel} to cancel current appointment.`;

export const wrongCommand =
  "I don't understand. Use /help to see list of commands.";

export const correctEmail = 'Email set.';
export const correctService = 'Service(s) selected.';
export const correctDate = 'Date selected.';
export const correctTime = 'Time selected.';
export const correctMaster = 'Master selected.';
export const correctAppointment = 'Appointment successful created.';

export const incorrectEmail = 'Email not ser.';
export const incorrectService = 'Service(s) not selected.';
export const incorrectDate = 'Date not selected.';
export const incorrectTime = 'Time not selected.';
export const incorrectMaster = 'Master not selected.';
export const incorrectAppointment = "Appointment can't be created.";

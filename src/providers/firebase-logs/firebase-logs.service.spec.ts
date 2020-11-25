// import { TestBed } from '@angular/core/testing';
// import { Firebase } from '@ionic-native/firebase';
// import { FirebaseLogsService } from './firebase-logs.service';

// describe('Provider: FirebaseLogsService', () => {
//   let firebaseLogsService: FirebaseLogsService;
//   let firebase: Firebase;
//   let eventName: string;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         FirebaseLogsService
//         {
//           provide: Firebase,
//           useValue: jasmine.createSpyObj<Firebase>(['logEvent', 'setScreenName'])
//         }
//       ]
//     });

//     firebaseLogsService = TestBed.get(FirebaseLogsService);
//     firebase = TestBed.get(Firebase);
//     eventName = 'testEvent';
//   });

//   afterEach(() => {
//     firebaseLogsService = null;
//     firebase = null;
//   });

//   it('should call firebase.logEvent without any parameter', () => {
//     firebaseLogsService.logEvent(eventName);
//     expect(firebase.logEvent).toHaveBeenCalledWith(eventName, {});
//   });

//   it('should call firebase.logEvent with 4 parameters', () => {
//     let testParameters = {
//       parameter0: 'value0',
//       parameter1: 'value1',
//       parameter2: 'value2',
//       parameter3: 'value3'
//     };
//     let testParametersKeys = Object.keys(testParameters);

//     firebaseLogsService.logEvent(
//       eventName,
//       testParametersKeys[0],
//       testParameters.parameter0,
//       testParametersKeys[1],
//       testParameters.parameter1,
//       testParametersKeys[2],
//       testParameters.parameter2,
//       testParametersKeys[3],
//       testParameters.parameter3
//     );
//     expect(firebase.logEvent).toHaveBeenCalledWith(eventName, testParameters);
//   });

//   it('should check if firebase.logEvent was called', () => {
//     firebaseLogsService.logEvent('somestring', 'somestring');
//     expect(firebase.logEvent).toHaveBeenCalled();
//     firebaseLogsService.logEvent('somestring', 'somestring', 'somestring');
//     expect(firebase.logEvent).toHaveBeenCalled();
//     firebaseLogsService.logEvent('somestring');
//     expect(firebase.logEvent).toHaveBeenCalled();
//     firebaseLogsService.logEvent(
//       'somestring',
//       'somestring',
//       'somestring',
//       'somestring',
//       'somestring',
//       'somestring',
//       'somestring'
//     );
//     expect(firebase.logEvent).toHaveBeenCalled();
//   });

//   it('should calculate date difference in seconds', () => {
//     let start = 1560410995134;
//     let end = 1560411004732;
//     expect(firebaseLogsService.differenceInSeconds(start, end)).toBe(10);
//   });

//   it('should call setScreenName method ', () => {
//     firebaseLogsService.setScreenName('Screen Name');
//     expect(firebase.setScreenName).toHaveBeenCalledWith('Screen Name');
//   });
// });

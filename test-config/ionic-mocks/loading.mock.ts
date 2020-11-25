export class LoadingMock {
  public static instance(): any {
    let instance = jasmine.createSpyObj('Loading', [
      'present',
      'dismiss',
      'dismissAll',
      'setContent',
      'setSpinner'
    ]);
    instance.present.and.returnValue(Promise.resolve());

    return instance;
  }
}

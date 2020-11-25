import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PlatformMock, StorageMock } from 'ionic-mocks';
import { AuthMode } from '@ionic-enterprise/identity-vault';

import { VaultService } from './vault.service';
import { BrowserAuthService } from '../browser-auth/browser-auth.service';
import { BrowserAuthPlugin } from '../browser-auth/brower-auth.plugin';

describe('VaultService', () => {
  let vault: VaultService;

  const browserAuthPluginMock = new BrowserAuthPlugin(
    new BrowserAuthService(StorageMock.instance())
  );

  beforeAll(() => {
    (window as any).IonicNativeAuth = new BrowserAuthPlugin(
      new BrowserAuthService(StorageMock.instance())
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        VaultService,
        {
          provide: BrowserAuthPlugin,
          useValue: browserAuthPluginMock
        },
        { provide: Platform, useValue: PlatformMock.instance() },
        { provide: Storage, useValue: StorageMock.instance() }
      ]
    });
  });

  beforeEach(inject([VaultService], (service: VaultService) => {
    vault = service;
  }));

  it('injects', () => {
    expect(vault).toBeTruthy();
  });

  it('should the auth storage mode', () => {
    spyOn(vault, 'setAuthMode');

    vault.setDesiredAuthMode();
    expect(vault.setAuthMode).toHaveBeenCalledWith(AuthMode.SecureStorage);
  });

  it('should check if vault is locked', async () => {
    spyOn(vault, 'getVault').and.returnValue(Promise.resolve({ isLocked: () => true }));

    vault.isLocked();

    const isLocked = await vault.getVault();
    expect(vault.getVault).toHaveBeenCalled();
    expect(isLocked).toBeTruthy();
  });
});

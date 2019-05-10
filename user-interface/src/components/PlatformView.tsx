import React from 'react';
import { Stack, Text, Link, FontWeights } from 'office-ui-fabric-react';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { ResponsiveMode } from 'office-ui-fabric-react/lib/utilities/decorators/withResponsiveMode';
import libs from '../../../core/libs.js';
import { settings, getSettings } from '../../../core/helpers/settings.js';
import { IPlatform, IClient, IClientConfig, ILib, ISettings, IPlatforms } from '../../../core/typings';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { backgroundColor } from '../index';
getSettings();

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 280 }
};

const ClientsDropdown: IDropdownOption[] = [
  // dropdown entries go here
];

interface IPlatformState {
  Client: IClient;
}

interface IPlatformView {
  Platform: IPlatform,
  DefaultClient: IClient,
  OnClientChanged?: Function,
  OnLoaded?: Function
}


function GetCurrentAppConfig(platform: string): IClientConfig {
  let prefferedApp: string = (settings as any)[platform].prefferedApp;
  return (libs as any).platforms[platform].clients[prefferedApp].config;
}

function GetCurrentPlatform(platformName: string): IPlatform {
  return (libs as any).platforms[platformName];
}

function GetDefaultClientForPlatform(platformName: string): IClient {
  let prefferedClient: string = (settings as any)[platformName].prefferedApp;
  return (libs as any).platforms[platformName].clients[prefferedClient];
}

function PopulateClientsDropdown(platform: string, clear?: boolean): void {
  if (clear) {
    while (ClientsDropdown.length > 0) ClientsDropdown.shift();
  }

  for (let i of Object.keys(((libs as unknown as ILib).platforms[platform].clients))) {
    ClientsDropdown.push({
      text: i,
      key: i
    });
  }
}

function RelaySettingsState() {
  chrome.runtime.sendMessage({
    updateSettings: settings
  });
}

export class PlatformView extends React.Component<IPlatformView, IPlatformState> {
  constructor(props: IPlatformView, state: IPlatformState) {
    super(props);
    this.state = {
      Client: this.props.DefaultClient
    };

    PopulateClientsDropdown(this.props.Platform.name, true);
  }

  componentDidMount() {
    if (this.props.OnLoaded != undefined) this.props.OnLoaded(this.props.DefaultClient);
  }

  OnClientSelected = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined, index?: number | undefined) => {
    if (option == undefined) return;

    let newClient = this.props.Platform.clients[option.key];
    this.setState({
      Client: newClient
    });

    if (this.props.OnClientChanged != undefined) {
      this.props.OnClientChanged(newClient);
    }

    (settings as ISettings)[this.props.Platform.name].prefferedApp = newClient.name;
    RelaySettingsState();
  };

  OnEnabledChanged = (event: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean | undefined) => {
    if (checked != undefined) (settings as ISettings)[this.props.Platform.name].isEnabled = checked;
    RelaySettingsState();
  };

  OnCloseOnSwitchChanged = (event: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean | undefined) => {
    if (checked != undefined) (settings as ISettings)[this.props.Platform.name].closeOnSwitch = checked;
    RelaySettingsState();
  };

  render() {
    return (
      <Stack
        horizontalAlign="start"
        verticalAlign="end"
        verticalFill
        gap={5}
        styles={{
          root: {
            margin: '0px 10px',
            textAlign: 'center',
            backgroundColor: backgroundColor
          }
        }}>

        <Toggle
          defaultChecked={(settings as ISettings)[this.props.Platform.name].isEnabled}
          label={"Auto launch with " + this.state.Client.name}
          inlineLabel={true}
          onChange={this.OnEnabledChanged}
        />

        <Toggle
          defaultChecked={(settings as ISettings)[this.props.Platform.name].closeOnSwitch}
          label="Close window on switch"
          inlineLabel={true}
          onChange={this.OnCloseOnSwitchChanged}
        />
        <Dropdown placeholder="Choose another app..." responsiveMode={ResponsiveMode.large} options={ClientsDropdown} styles={dropdownStyles} onChange={this.OnClientSelected} />
      </Stack>
    );
  }
};
import * as React from 'react';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { mergeStyleSets, getTheme, DefaultFontStyles, FontSizes, getFocusStyle } from 'office-ui-fabric-react/lib/Styling';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { IPlatform } from '../../../../core/typings';
import { Panel, PanelType, ISettings } from 'office-ui-fabric-react';
import { PlatformView } from '../PlatformView';
import { settings } from '../../../../core/helpers/settings';

export interface IPlatformSelectorProps {
    items: IPlatform[];
}

interface IPlatformSelectorState {
    allItems: IPlatform[];
    shownItems: IPlatform[];
    SelectedPlatform: IPlatformSelectedState;
}

interface IPlatformSelectedState {
    PanelIsOpen: boolean;
    Platform?: IPlatform;
}

const theme = getTheme();
const classNames = mergeStyleSets({
    container: {
        overflow: 'auto',
        maxHeight: 500
    },
    itemCell: [
        getFocusStyle(theme, { inset: -1 }),
        {
            minHeight: 54,
            padding: 10,
            boxSizing: 'border-box',
            borderBottom: `1px solid ${theme.semanticColors.bodyDivider}`,
            display: 'flex',
            selectors: {
                '&:hover': { background: theme.palette.neutralLight }
            }
        }
    ],
    itemImage: {
        flexShrink: 0
    },
    itemContent: {
        marginLeft: 10,
        overflow: 'hidden',
        flexGrow: 1
    },
    itemName: [
        DefaultFontStyles.xLarge,
        {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    ],
    itemIndex: {
        fontSize: FontSizes.small,
        color: theme.palette.neutralTertiary,
        marginBottom: 10
    },
    chevron: {
        alignSelf: 'center',
        marginLeft: 10,
        color: theme.palette.neutralTertiary,
        fontSize: FontSizes.large,
        flexShrink: 0
    }
});

export class PlatformSelector extends React.Component<IPlatformSelectorProps, IPlatformSelectorState> {
    constructor(props: IPlatformSelectorProps) {
        super(props);

        this._onFilterChanged = this._onFilterChanged.bind(this);
        this._onRenderCell = this._onRenderCell.bind(this);
        this.onPlatformClicked = this.onPlatformClicked.bind(this);

        this.state = {
            allItems: this.props.items,
            shownItems: this.props.items,
            SelectedPlatform: {
                PanelIsOpen: false
            }
        };
    }
    public render(): JSX.Element {
        return (
            <div>
                {(() => {
                    if (this.state.SelectedPlatform.Platform != undefined) {
                        return <Panel
                            styles={{
                                navigation: {
                                    position: "absolute",
                                    width: "100vw"
                                },
                                header: {
                                    marginTop: "10px"
                                }
                            }}
                            isOpen={this.state.SelectedPlatform.PanelIsOpen}
                            type={PanelType.smallFluid}
                            headerText={this.state.SelectedPlatform.Platform.name}>
                            <PlatformView Platform={this.state.SelectedPlatform.Platform} DefaultClient={this.state.SelectedPlatform.Platform.clients[(settings as ISettings)[this.state.SelectedPlatform.Platform.name].prefferedApp]} />
                        </Panel>;
                    }
                })()
                }
                <FocusZone direction={FocusZoneDirection.vertical}>
                    <SearchBox
                        placeholder="Filter"
                        onChange={this._onFilterChanged}
                        iconProps={{ iconName: 'Filter' }}
                    />

                    <div className={classNames.container} data-is-scrollable={true}>
                        <List items={this.state.shownItems} onRenderCell={this._onRenderCell} />
                    </div>
                </FocusZone>
            </div>
        );
    }

    private _onFilterChanged(newValue: any) {
        if (newValue == "") {
            this.setState({
                allItems: this.state.allItems,
                shownItems: this.state.allItems
            });
            return;
        }
        this.setState({
            allItems: this.state.allItems,
            shownItems: [...this.state.shownItems.filter(item => item.name.toLowerCase().includes(newValue.toLowerCase()))]
        });
    }
    private onPlatformClicked(platform: IPlatform) {
        this.setState({
            allItems: this.state.allItems,
            shownItems: this.state.allItems,
            SelectedPlatform: {
                PanelIsOpen: true,
                Platform: platform
            }
        });
    }
    private _onRenderCell(item?: IPlatform | undefined, index?: number | undefined, isScrolling?: boolean | undefined): JSX.Element {
        return (
            <div className={classNames.itemCell} data-is-focusable={true} onClick={() => { if (item) this.onPlatformClicked(item) }}>
                <Image
                    className={classNames.itemImage}
                    src={isScrolling || item == undefined ? undefined : item.icon}
                    width={50}
                    height={50}
                    imageFit={ImageFit.centerContain}
                />
                <div className={classNames.itemContent}>
                    <div className={classNames.itemName}>{item != undefined ? item.name : ""}</div>
                </div>
            </div>
        );
    }
}
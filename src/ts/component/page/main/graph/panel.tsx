import * as React from 'react';
import { observer } from 'mobx-react';
import $ from 'jquery';
import { I, Util } from 'Lib';
import { Icon } from 'Component';
import Controls from './controls';
import Preview from './preview';
import Filters from './filters';

interface Props extends I.PageComponent {
    data: any;
    onFilterChange: (v: string) => void;
    onSwitch: (id: string, v: string) => void;
	onContextMenu?: (id: string, param: any) => void;
    togglePanel: (v: boolean) => void;
};

interface State {
    view: I.GraphView;
    rootId: string;
};

const Tabs = [
    { id: I.GraphView.Controls, name: 'View' },
    //{ id: I.GraphView.Filter, name: 'Filters' },
];

const GraphPanel = observer(class Graph extends React.Component<Props, State> {

	node: any = null;
    state = {
        view: I.GraphView.Controls,
        rootId: '',
    };
    ref: any = null;

	constructor (props: Props) {
		super(props);

        this.setState = this.setState.bind(this);
        this.onClose = this.onClose.bind(this);
	};

	render () {
		const { view, rootId } = this.state;

        let content = null;
        let tabs = (
            <div className="tabs">
                {Tabs.map((item: any, i: number) => (
                    <div 
                        key={i} 
                        className={[ 'tab', (item.id == view ? 'active' : '') ].join(' ')} 
                        onClick={() => { this.onTab(item.id); }}
                    >
                        {item.name}
                    </div>
                ))}

                <Icon className="close" onClick={this.onClose} />
            </div>
        );

        switch (view) {
            default:
            case I.GraphView.Controls:
                content = <Controls ref={(ref: any) => { this.ref = ref; }} {...this.props} />;
                break;

            case I.GraphView.Preview:
                tabs = null;
                content = <Preview ref={(ref: any) => { this.ref = ref; }} {...this.props} rootId={rootId} onClose={this.onClose} />;
                break;
            
            case I.GraphView.Filter:
                content = <Filters ref={(ref: any) => { this.ref = ref; }} {...this.props} />;
                break;
        };

		return (
			<div 
				ref={node => this.node = node} 
				id="panel"
			>
                {tabs}
                {content}
			</div>
		);
	};

    componentDidMount () {
        this.resize();
    };

    componentDidUpdate () {
        this.resize();
    };

    onTab (view: I.GraphView) {
        this.setState({ view });
    };

    onClose () {
        this.props.togglePanel(false);
        this.onTab(I.GraphView.Controls);

        if (this.ref && this.ref.onClose) {
            this.ref.onClose();
        };
    };

    resize () {
        const node = $(this.node);
		const container = Util.getPageContainer(this.props.isPopup);
		const header = container.find('#header');
		const tabs = node.find('.tabs');
		const hh = header.height();

		tabs.css({ lineHeight: hh + 'px' });
    };

});

export default GraphPanel;
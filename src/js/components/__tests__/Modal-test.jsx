'use strict';

import React from 'react';
import { findDOMNode } from 'react-dom';
import createParent from '../../../../test/util/createParent';
import Modal from '../Modal';
import Icon from '../Icon';

import {
    createRenderer,
    renderIntoDocument,
    findRenderedDOMComponentWithClass,
    Simulate
} from 'react-addons-test-utils';


describe('<Modal />', () => {
    describe('DOM', () => {
        it('should render properly', () => {
            const childJSX = (
                <div className="modal-child">hey</div>
            );

            const shallowRenderer = createRenderer();
            shallowRenderer.render(<Modal>{ childJSX }</Modal>);
            const actualElement = shallowRenderer.getRenderOutput();

            expect(actualElement).to.equalJSX((
                <div className="modal-overlay" onClick={ () => {} }>
                    <div className="modal-inner" onClick={ () => {} }>
                        <a href="#" onClick={ () => {} } className="modal-close">
                            <Icon svg={ require('../../../svg/close.svg') } />
                            <span className="sr-only">Hide Modal</span>
                        </a>
                        { childJSX }
                    </div>
                </div>
            ));
        });
    });

    describe('Behavior', () => {
        let parent;
        let modal;
        let hideModalSpy;

        beforeEach(() => {
            hideModalSpy = sinon.spy();

            let ModalParent = createParent(Modal, 'modal', {
                hideModal: hideModalSpy,
                children: <div />
            });

            parent = renderIntoDocument(<ModalParent />);
            modal = parent.refs.modal;
        });

        it('should call props.hideModal when .modal-overlay is clicked', () => {
            expect(hideModalSpy).to.have.not.been.called;
            Simulate.click(findDOMNode(modal));
            expect(hideModalSpy).to.have.been.called;
        });

        it('should call props.hideModal when .modal-close is clicked', () => {
            const modalClose = findRenderedDOMComponentWithClass(modal, 'modal-close');
            expect(hideModalSpy).to.have.not.been.called;
            Simulate.click(findDOMNode(modalClose));
            expect(hideModalSpy).to.have.been.called;
        });

        // TODO: figure out how to test this
        // it('should call props.hideModal when escape key is pressed', () => {
        //     expect(hideModalSpy).to.have.not.been.called;
        //     Simulate.keyPress(document, { keyCode: 27 });
        //     expect(hideModalSpy).to.have.been.called;
        // });

        it('should not be removed when .modal-inner is clicked', () => {
            const modalInner = findRenderedDOMComponentWithClass(modal, 'modal-inner');
            expect(hideModalSpy).to.have.not.been.called;
            Simulate.click(findDOMNode(modalInner));
            expect(hideModalSpy).to.have.not.been.called;
        });
    });
});
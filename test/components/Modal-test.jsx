'use strict';

import createParent from '../util/createParent';
import { findDOMNode } from 'react-dom';

var React;
var Modal;
var TestUtils;

describe('Modal Component', () => {

    beforeEach(() => {
        React = require('react');
        Modal = require('../../src/js/components/Modal');
        TestUtils = require('react-addons-test-utils');
    });

    describe('DOM', () => {
        let modal;
        let modalChild;

        beforeEach(() => {
            modalChild = <div className="modal-child" />;
            const shallowRenderer = TestUtils.createRenderer();
            shallowRenderer.render(<Modal>{ modalChild }</Modal>);
            modal = shallowRenderer.getRenderOutput();
        });

        it('should render <div className="modal-overlay" />', () => {
            expect(modal.props.className).to.equal('modal-overlay');
        });

        it('should render a child <Link className="modal-inner" />', () => {
            const modalInner = modal.props.children;
            expect(modalInner.props.className).to.equal('modal-inner');
        });

        it('should render a child <a className="modal-close" />', () => {
            const modalClose = modal.props.children.props.children[0];
            expect(modalClose.props.className).to.equal('modal-close');
        });

        it('should render additional children after .modal-close', () => {
            const modalChildren = modal.props.children.props.children;
            expect(modalChildren.length).to.equal(2);
            expect(modalChildren[1]).to.equal(modalChild);
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

            parent = TestUtils.renderIntoDocument(<ModalParent />);
            modal = parent.refs.modal;
        });

        it('should call props.hideModal when .modal-overlay is clicked', () => {
            expect(hideModalSpy).to.have.not.been.called;
            TestUtils.Simulate.click(findDOMNode(modal));
            expect(hideModalSpy).to.have.been.called;
        });

        it('should call props.hideModal when .modal-close is clicked', () => {
            const modalClose = TestUtils.findRenderedDOMComponentWithClass(modal, 'modal-close');
            expect(hideModalSpy).to.have.not.been.called;
            TestUtils.Simulate.click(findDOMNode(modalClose));
            expect(hideModalSpy).to.have.been.called;
        });

        // TODO: figure out how to test this
        // it('should call props.hideModal when escape key is pressed', () => {
        //     expect(hideModalSpy).to.have.not.been.called;
        //     TestUtils.Simulate.keyPress(document, { keyCode: 27 });
        //     expect(hideModalSpy).to.have.been.called;
        // });

        it('should not be removed when .modal-inner is clicked', () => {
            const modalInner = TestUtils.findRenderedDOMComponentWithClass(modal, 'modal-inner');
            expect(hideModalSpy).to.have.not.been.called;
            TestUtils.Simulate.click(findDOMNode(modalInner));
            expect(hideModalSpy).to.have.not.been.called;
        });
    });
});
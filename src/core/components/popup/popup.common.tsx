/** @jsxRuntime classic */
/** @jsx createElement */
import { Button } from '@framework/components/button';
import { Portal as Port } from '@framework/portal';
import { createElement, Fragment, isPreact, ON_ANIMATION_END, ON_KEY_DOWN } from '@framework/renderer';
import { isString, UNDEFINED } from '../../util/misc';
import { MbscPopupState, PopupBase } from './popup';
import { MbscPopupOptions } from './popup.types.public';

import '../../base.scss';
import './popup.scss';

const Portal: any = Port;

export function template(s: MbscPopupOptions, state: MbscPopupState, inst: PopupBase, content: any, slots?: any): any {
  const hb = inst._hb;
  const rtl = inst._rtl;
  const theme = inst._theme;
  const display = s.display;
  const keydown = { [ON_KEY_DOWN]: inst._onKeyDown };
  const animationEnd = { [ON_ANIMATION_END]: inst._onAnimationEnd };

  const renderHeader = (slots && slots.header) || s.renderHeader;
  const headerContent = renderHeader ? renderHeader() : s.headerText || UNDEFINED;
  const headerHtml = renderHeader && isString(headerContent) && isPreact ? { __html: headerContent } : UNDEFINED;

  if (!headerHtml) {
    inst._headerHTML = UNDEFINED;
  } else if (headerContent !== inst._headerHTML) {
    inst._shouldEnhance = inst._popup || true;
    if (inst._popup) {
      inst._headerHTML = headerContent;
    }
  }

  return inst._isModal ? (
    inst._isVisible ? (
      <Portal context={inst._ctx}>
        <div
          className={
            'mbsc-font mbsc-flex mbsc-popup-wrapper mbsc-popup-wrapper-' +
            display +
            theme +
            rtl +
            ' ' +
            inst._className +
            (s.fullScreen ? ' mbsc-popup-wrapper-' + display + '-full' : '') +
            (inst._touchUi ? '' : ' mbsc-popup-pointer') +
            (inst._round ? ' mbsc-popup-round' : '') +
            (inst._hasContext ? ' mbsc-popup-wrapper-ctx' : '') +
            (state.isReady ? '' : ' mbsc-popup-hidden')
          }
          ref={inst._setWrapper}
          {...keydown}
        >
          {s.showOverlay && (
            <div
              className={
                'mbsc-popup-overlay mbsc-popup-overlay-' +
                display +
                theme +
                (inst._isClosing ? ' mbsc-popup-overlay-out' : '') +
                (inst._isOpening && state.isReady ? ' mbsc-popup-overlay-in' : '')
              }
              onClick={inst._onOverlayClick}
            />
          )}
          <div className={'mbsc-popup-limits mbsc-popup-limits-' + display} ref={inst._setLimitator} style={inst._limits} />
          <div
            className={
              'mbsc-flex-col mbsc-popup mbsc-popup-' +
              display +
              (s.fullScreen ? '-full' : '') +
              theme +
              hb +
              // (this._short ? ' mbsc-popup-short' : '') +
              (state.bubblePos && state.showArrow && display === 'anchored' ? ' mbsc-popup-anchored-' + state.bubblePos : '') +
              (inst._isClosing ? ' mbsc-popup-' + inst._animation + '-out' : '') +
              (inst._isOpening && state.isReady ? ' mbsc-popup-' + inst._animation + '-in' : '')
            }
            role="dialog"
            aria-label={s.ariaLabel}
            aria-modal="true"
            ref={inst._setPopup}
            style={inst._style}
            onClick={inst._onPopupClick}
            {...animationEnd}
          >
            {display === 'anchored' && state.showArrow && (
              <div className={'mbsc-popup-arrow-wrapper mbsc-popup-arrow-wrapper-' + state.bubblePos + theme}>
                <div className={'mbsc-popup-arrow mbsc-popup-arrow-' + state.bubblePos + theme} style={state.arrowPos} />
              </div>
            )}
            <div className="mbsc-popup-focus" tabIndex={-1} ref={inst._setActive} />
            <div
              className={
                'mbsc-flex-col mbsc-flex-1-1 mbsc-popup-body mbsc-popup-body-' +
                display +
                theme +
                hb +
                (s.fullScreen ? ' mbsc-popup-body-' + display + '-full' : '') +
                // (this._short ? ' mbsc-popup-short' : '') +
                (inst._round ? ' mbsc-popup-body-round' : '')
              }
            >
              {headerContent && (
                <div
                  className={
                    'mbsc-flex-none mbsc-popup-header mbsc-popup-header-' +
                    display +
                    theme +
                    hb +
                    (inst._buttons ? '' : ' mbsc-popup-header-no-buttons')
                  }
                  dangerouslySetInnerHTML={headerHtml}
                >
                  {headerHtml ? null : headerContent}
                </div>
              )}
              <div
                className={'mbsc-flex-1-1 mbsc-popup-content' + (s.contentPadding ? ' mbsc-popup-padding' : '') + theme}
                ref={inst._setContent}
              >
                {content}
              </div>
              {inst._buttons && (
                <div
                  className={
                    'mbsc-flex-none mbsc-popup-buttons mbsc-popup-buttons-' +
                    display +
                    theme +
                    rtl +
                    hb +
                    (inst._flexButtons ? ' mbsc-flex' : '') +
                    (s.fullScreen ? ' mbsc-popup-buttons-' + display + '-full' : '')
                  }
                >
                  {inst._buttons.map((btn, i) => (
                    <Button
                      color={btn.color}
                      className={
                        'mbsc-popup-button mbsc-popup-button-' +
                        display +
                        rtl +
                        hb +
                        (inst._flexButtons ? ' mbsc-popup-button-flex' : '') +
                        ' ' +
                        (btn.cssClass || '')
                      }
                      icon={btn.icon}
                      disabled={btn.disabled}
                      key={i}
                      theme={s.theme}
                      themeVariant={s.themeVariant}
                      variant={btn.variant || s.buttonVariant}
                      onClick={btn.handler}
                    >
                      {btn.text}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Portal>
    ) : null
  ) : (
    <Fragment>{content}</Fragment>
  );
}

export class Popup extends PopupBase {
  protected _template(s: MbscPopupOptions, state: MbscPopupState): any {
    return template(s, state, this, s.children);
  }
}

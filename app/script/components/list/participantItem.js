/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

'use strict';

window.z = window.z || {};
window.z.components = z.components || {};

z.components.ParticipantItem = class ParticipantItem {
  constructor(params) {
    this.participant = ko.unwrap(params.participant);
    this.isService = this.participant instanceof z.integration.ServiceEntity || this.participant.isBot;
    this.isUser = this.participant instanceof z.entity.User && !this.participant.isBot;
    this.selfUser = window.wire.app.repository.user.self;
    this.contentInfo = this.isService ? this.participant.summary : this.participant.username();
    this.mode = params.mode || z.components.UserList.MODE.DEFAULT;
    this.isDefaultMode = this.mode === z.components.UserList.MODE.DEFAULT;
    this.isOthersMode = this.mode === z.components.UserList.MODE.OTHERS;

    this.canSelect = params.canSelect;
    this.isSelected = params.isSelected;
  }
};

ko.components.register('participant-item', {
  template: `
    <div class="participant-item" data-bind="attr: isUser ? { 'data-uie-name': 'item-user', 'data-uie-uid': participant.id, 'data-uie-value': participant.name(), 'data-uie-status': participant.connection().status()} : {'data-uie-name': 'item-service'}">
      <div class="participant-item-image">
        <participant-avatar params="participant: participant, size: z.components.ParticipantAvatar.SIZE.SMALL"></participant-avatar>
      </div>

      <div class="participant-item-content">
        <!-- ko if: isUser && selfUser().is_team_member() -->
          <availability-state class="participant-item-content-availability participant-item-content-name"
            data-uie-name="status-availability"
            params="availability: participant.availability, label: participant.name"></availability-state>
        <!-- /ko -->

        <!-- ko if: isService || !selfUser().is_team_member() -->
          <div class="participant-item-content-name" data-bind="text: participant.name"></div>
        <!-- /ko -->
        <div class="participant-item-content-info">
          <!-- ko if: contentInfo -->
            <span class="participant-item-content-username label-username-notext" data-bind="text: contentInfo, css: {'label-username': isUser}"></span>
          <!-- /ko -->
        </div>
      </div>

      <!-- ko if: isUser && !isOthersMode && participant.is_guest() -->
        <div class="participant-item-guest-indicator" data-uie-name="status-guest">
          <svg width="14" height="16" viewBox="0 0 14 16">
            <path d="M5 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3c0-1.1.9-2 2-2h3zm.5 1a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-2 1a2 2 0 0 0-2 2v1h8v-1a2 2 0 0 0-2-2H5z"/>
          </svg>
        </div>
      <!-- /ko -->
      <!-- ko if: canSelect -->
        <div class="search-list-item-select icon-check" data-bind="css: {'selected': isSelected}" data-uie-name="status-selected"></div>
      <!-- /ko -->
</div>
  `,
  viewModel: z.components.ParticipantItem,
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CharacterId, CharacterState } from '../types/character';
import { Dino2DCharacter } from './Dino2DCharacter';
import { Robo2DCharacter } from './Robo2DCharacter';
import { Bunny2DCharacter } from './Bunny2DCharacter';

interface CharacterViewerProps {
  characterId: CharacterId;
  state: CharacterState;
  size?: number;
}

export const CharacterViewer: React.FC<CharacterViewerProps> = ({
  characterId,
  state,
  size = 280,
}) => {
  switch (characterId) {
    case 'robo':
      return <Robo2DCharacter state={state} size={size} />;
    case 'bunny':
      return <Bunny2DCharacter state={state} size={size} />;
    case 'dino':
    default:
      return <Dino2DCharacter state={state} size={size} />;
  }
};

const styles = StyleSheet.create({});

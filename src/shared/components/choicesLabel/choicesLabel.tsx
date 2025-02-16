
import type { TChoicesLabelProps } from '../../types/labelProps.type.ts';
import './choicesLabel.style.css';
import React from 'react';

export default function ChoicesLabel(props: TChoicesLabelProps) {
    const {name, link} = props;
    return <a href={link} className='choices-label-container'><span>{name}</span></a>
}
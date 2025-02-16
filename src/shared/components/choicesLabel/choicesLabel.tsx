import type { TChoicesLabelProps } from '../../types/labelProps.type.ts';
import './choicesLabel.style.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default function ChoicesLabel(props: TChoicesLabelProps) {
    const {name, link} = props;
    return (
        <Link to={link} className='choices-label-container'>
            <span>{name}</span>
        </Link>
    );
}
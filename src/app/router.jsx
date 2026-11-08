import React from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { IntroPage } from '../pages/IntroPage';
import { UniversePage } from '../pages/UniversePage';
import { ArcadePage } from '../pages/ArcadePage';
import { BoyfriendCourtPage } from '../pages/BoyfriendCourtPage';
import { VendingMachinePage } from '../pages/VendingMachinePage';
import { MemoryGalaxyPage } from '../pages/MemoryGalaxyPage';
import { FinalSurprisePage } from '../pages/FinalSurprisePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <IntroPage />
      },
      {
        path: 'universe',
        element: <UniversePage />
      },
      {
        path: 'arcade',
        element: <ArcadePage />
      },
      {
        path: 'court',
        element: <BoyfriendCourtPage />
      },
      {
        path: 'vending-machine',
        element: <VendingMachinePage />
      },
      {
        path: 'memory-galaxy',
        element: <MemoryGalaxyPage />
      },
      {
        path: 'final-surprise',
        element: <FinalSurprisePage />
      },
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);
